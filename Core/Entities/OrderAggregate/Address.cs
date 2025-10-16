using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class Address

    {   

        public Address()
        {

        }
        public Address(string firstName, string street, string state, string lastName, string city, string zipCode) 
        {
            this.FirstName = firstName;
            this.Street = street;
            this.State = state;
            this.LastName = lastName;
            this.City = city;
            this.ZipCode = zipCode;
        }

        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

    }
}