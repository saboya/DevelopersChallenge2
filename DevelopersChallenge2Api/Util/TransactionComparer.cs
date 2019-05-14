namespace DevelopersChallenge2Api.Util
{
    using System.Collections.Generic;
    using DevelopersChallenge2Api.Models;

    public class TransactionComparer : IEqualityComparer<Transaction>
    {
        bool IEqualityComparer<Transaction>.Equals(Transaction x, Transaction y)
        {
            // Check whether the compared objects reference the same data.
            if (object.ReferenceEquals(x, y))
            {
                return true;
            }

            // Check whether any of the compared objects is null.
            if (x is null || y is null)
            {
                return false;
            }

            return GetTransactionHashCode(x) == GetTransactionHashCode(y);
        }

        int IEqualityComparer<Transaction>.GetHashCode(Transaction t)
        {
            return GetTransactionHashCode(t);
        }

        private static int GetTransactionHashCode(Transaction t)
        {
            int hash = 17;
            hash = (hash * 23) + t.Amount.GetHashCode();
            hash = (hash * 23) + (t.Description ?? string.Empty).GetHashCode();
            hash = (hash * 23) + (t.Timestamp.ToString() ?? string.Empty).GetHashCode();
            return hash;
        }
    }
}
