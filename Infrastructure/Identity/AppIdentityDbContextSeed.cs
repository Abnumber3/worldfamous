using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "BobbyBrown111",
                    Address = new Address
                    {
                        FirstName = "Bob",
                        LastName = "Brown",
                        Street = "123 Main St",
                        City = "Anytown",
                        State = "CA",
                        ZipCode = "12345"
                    }

                };

                var result = await userManager.CreateAsync(user, "Monkey3@!");
                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"[SEED ERROR] {error.Description}");
                    }
                }
                else
                {
                    Console.WriteLine("[SEED SUCCESS] Bob was created.");
                }
            }
            else
            {
                Console.WriteLine("[SEED] Bob already exists.");
            }
            }
        }
    }
