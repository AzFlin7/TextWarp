using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Document
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? JsonPath { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? State { get; set; }
    }
}
