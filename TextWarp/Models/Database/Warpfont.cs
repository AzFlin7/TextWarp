using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Warpfont
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? Thumbnail { get; set; }
    }
}
