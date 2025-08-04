using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{
public class AppIdentityDbContext : IdentityDbContext<AppUser, IdentityRole<int>, int>
{
    public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

    builder.Entity<AppUser>()
        .HasOne(u => u.Address)
        .WithOne(a => a.AppUser)
        .HasForeignKey<Address>(a => a.Id); // or a.AppUserId if you define it explicitly
    }
}
}