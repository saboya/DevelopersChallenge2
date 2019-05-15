namespace DevelopersChallenge2Api.Util
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;
    using DevelopersChallenge2Api.Models;

    public class OfxParser
    {
        private static readonly string DateFormat = "yyyyMMddHHmmss";

        private static readonly Regex DateTimeRegexp = new Regex(
            @"^(\d+)\[(.*?):\w+\]$",
            RegexOptions.Compiled | RegexOptions.CultureInvariant);

        private static readonly Regex CurrencyRegexp = new Regex(
            @"<CURDEF>(.*?)\n",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex BankAccountRegex = new Regex(
            @"<BANKACCTFROM>(.*?)</BANKACCTFROM>",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex LedgerRegex = new Regex(
            @"<LEDGERBAL>(.*?)</LEDGERBAL>",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex BankSectionRegex = new Regex(
            @"<STMTTRNRS>(.*?)</STMTTRNRS>",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex TransactionRegex = new Regex(
            @"<STMTTRN>(.*?)</STMTTRN>",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex FlatFieldsRegex = new Regex(
            @"<(.*?)>(.*?)\n",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex HeaderRegex = new Regex(
            @"^(OFXHEADER|DATA|VERSION|SECURITY|ENCODING|CHARSET|COMPRESSION|OLDFILEUID|NEWFILEUID):(.*)$",
            RegexOptions.Compiled | RegexOptions.CultureInvariant);

        public static void ValidateHeader(Dictionary<string, string> headerMap)
        {
            if (!headerMap.ContainsKey("DATA"))
            {
                throw new Exception("Missing DATA header field.");
            }
        }

        public static IEnumerable<BankSection> ParseFile(string filePath)
        {
            FileStream fileStream = new FileStream(filePath, FileMode.Open);
            return ParseFile(fileStream);
        }

        public static IEnumerable<BankSection> ParseFile(Stream stream)
        {
            using (StreamReader reader = new StreamReader(stream))
            {
                string textRead = reader.ReadLine();
                Match firstLineMatch = HeaderRegex.Match(textRead);

                if (!firstLineMatch.Success || firstLineMatch.Groups[1].Value != "OFXHEADER")
                {
                    throw new Exception("File is not an OFX file.");
                }

                if (firstLineMatch.Groups[2].Value != "100")
                {
                    throw new Exception("Unsupported header version");
                }

                var header = ParseHeader(reader);

                textRead = reader.ReadToEnd();

                return BankSectionRegex.Matches(textRead)
                    .Select(match => ParseBankSection(match.Groups[1].Value));
            }
        }

        protected static Dictionary<string, string> ParseHeader(StreamReader reader)
        {
                Match match;
                string line;

                var header = new Dictionary<string, string>();

                do
                {
                    line = reader.ReadLine();
                    if (line == string.Empty)
                    {
                        break;
                    }
                    else if (line == null)
                    {
                        throw new Exception("Unexpected end of header.");
                    }

                    match = HeaderRegex.Match(line);
                    if (!match.Success)
                    {
                        throw new Exception("Invalid header entry: " + line);
                    }

                    header.Add(match.Groups[1].Value, match.Groups[2].Value);
                }
                while (line != string.Empty);

                ValidateHeader(header);

                return header;
        }

        protected static Transaction ParseTransaction(string text)
        {
            var transaction = new Transaction();

            foreach (Match match in FlatFieldsRegex.Matches(text))
            {
                var field = match.Groups[1].Value;
                var value = match.Groups[2].Value;

                switch (field)
                {
                    case "TRNTYPE":
                        transaction.OperationType = value;
                        break;
                    case "DTPOSTED":
                        transaction.Timestamp = OfxDateStringToUnixTimeSeconds(value);
                        break;
                    case "TRNAMT":
                        transaction.Amount = double.Parse(value);
                        break;
                    case "MEMO":
                        transaction.Description = value;
                        break;
                }
            }

            return transaction;
        }

        protected static long OfxDateStringToUnixTimeSeconds(string ofxDateString)
        {
            var dateMatch = DateTimeRegexp.Match(ofxDateString);

            if (!dateMatch.Success)
            {
                throw new Exception("Invalid date format");
            }

            DateTime dateTime = DateTime
                .ParseExact(dateMatch.Groups[1].Value, DateFormat, CultureInfo.InvariantCulture)
                .AddHours(double.Parse(dateMatch.Groups[2].Value));

            DateTimeOffset offset = new DateTimeOffset(dateTime);
            return offset.ToUnixTimeSeconds();
        }

        protected static string ParseCurrency(string text)
        {
            string currency = string.Empty;

            var currencyMatch = CurrencyRegexp.Match(text);

            if (currencyMatch.Success)
            {
                currency = currencyMatch.Groups[1].Value;
            }

            return currency;
        }

        protected static BankSection ParseBankSection(string text)
        {
            string currency = ParseCurrency(text);
            string acctId = string.Empty;
            string bankId = string.Empty;

            var backAccountMatch = BankAccountRegex.Match(text);

            if (backAccountMatch.Success)
            {
                foreach (Match match in FlatFieldsRegex.Matches(text))
                {
                    var field = match.Groups[1].Value;
                    var value = match.Groups[2].Value;

                    switch (field)
                    {
                        case "BANKID":
                            bankId = value;
                            break;
                        case "ACCTID":
                            acctId = value;
                            break;
                    }
                }
            }

            BankSection bankSection = new BankSection();
            bankSection.Balance = new Balance();
            bankSection.Balance.AcctId = acctId;
            bankSection.Balance.BankId = bankId;
            bankSection.Balance.Currency = currency;

            bankSection.Transactions = TransactionRegex.Matches(text)
                .Select(match =>
                {
                    var transaction = ParseTransaction(match.Groups[1].Value);

                    transaction.AcctId = acctId;
                    transaction.BankId = bankId;
                    transaction.Currency = currency;

                    return transaction;
                });

            var ledgerMatch = LedgerRegex.Match(text);
            if (ledgerMatch.Success)
            {
                foreach (Match match in FlatFieldsRegex.Matches(text))
                {
                    var field = match.Groups[1].Value;
                    var value = match.Groups[2].Value;

                    switch (field)
                    {
                        case "BALAMT":
                            bankSection.Balance.Amount = double.Parse(value);
                            break;
                        case "DTASOF":
                            bankSection.Balance.Timestamp = OfxDateStringToUnixTimeSeconds(value);
                            break;
                    }
                }
            }

            return bankSection;
        }
    }
}
