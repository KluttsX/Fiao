using Fiao.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
namespace Fiao.API.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<Client> Clients { get; set; }
    }
}
