using Microsoft.EntityFrameworkCore.Migrations;

namespace DevelopersChallenge2Api.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Balances",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Timestamp = table.Column<long>(nullable: false),
                    Amount = table.Column<double>(nullable: false),
                    BankId = table.Column<string>(nullable: true),
                    AcctId = table.Column<string>(nullable: true),
                    Currency = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Balances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Timestamp = table.Column<long>(nullable: false),
                    Amount = table.Column<double>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    OperationType = table.Column<string>(nullable: true),
                    BankId = table.Column<string>(nullable: true),
                    AcctId = table.Column<string>(nullable: true),
                    Currency = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Balances_Timestamp_AcctId_BankId",
                table: "Balances",
                columns: new[] { "Timestamp", "AcctId", "BankId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Timestamp_Description_Amount_BankId_AcctId",
                table: "Transactions",
                columns: new[] { "Timestamp", "Description", "Amount", "BankId", "AcctId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Balances");

            migrationBuilder.DropTable(
                name: "Transactions");
        }
    }
}
