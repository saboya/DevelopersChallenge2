namespace DevelopersChallenge2Api.Util
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;
    using DevelopersChallenge2Api.Models;

    public class BankSection
    {
        public IEnumerable<Transaction> Transactions;

        public Balance Balance;
    }
}
