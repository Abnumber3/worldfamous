using System;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Core.Entities;

public class ProductType : BaseEntity
{
    public string Name { get; set; } = string.Empty;

}

            