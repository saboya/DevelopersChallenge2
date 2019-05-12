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

        private static readonly Regex BankSectionRegex = new Regex(
            @"<STMTTRNRS>(.*?)</STMTTRNRS>",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex TransactionRegex = new Regex(
            @"<STMTTRN>(.*?)</STMTTRN>",
            RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private static readonly Regex TransactionFieldsRegex = new Regex(
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

        public static IEnumerable<Transaction> ParseFile(string filePath)
        {
            FileStream fileStream = new FileStream(filePath, FileMode.Open);
            return ParseFile(fileStream);
        }

        public static IEnumerable<Transaction> ParseFile(FileStream fileStream)
        {
            using (StreamReader reader = new StreamReader(fileStream))
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

                return (from match in BankSectionRegex.Matches(textRead)
                    select ParseBankSection(match.Groups[1].Value))
                    .Aggregate((acc, t) => acc.Concat(t))
                    .OrderBy(t => t.Id);
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

            foreach (Match match in TransactionFieldsRegex.Matches(text))
            {
                var field = match.Groups[1].Value;
                var value = match.Groups[2].Value;

                switch (field)
                {
                    case "TRNTYPE":
                        transaction.OperationType = value;
                        break;
                    case "DTPOSTED":
                        var dateMatch = DateTimeRegexp.Match(value);

                        if (!match.Success) {
                            throw new Exception("Invalid date format");
                        }

                        transaction.Timestamp = DateTime
                            .ParseExact(dateMatch.Groups[1].Value, DateFormat, CultureInfo.InvariantCulture)
                            .AddHours(double.Parse(dateMatch.Groups[2].Value));
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

        protected static IEnumerable<Transaction> ParseBankSection(string text)
        {
            return from match in TransactionRegex.Matches(text)
                select ParseTransaction(match.Groups[1].Value);
        }
    }
}
