using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Brush
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string JsonPath { get; set; } = null!;
        public int Version { get; set; }
    }
}
