using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Document
    {
        public int Id { get; set; }
        public string MediaId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Version { get; set; }
        public string JsonPath { get; set; } = null!;
        public string PreviewImg { get; set; } = null!;
        public string State { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
