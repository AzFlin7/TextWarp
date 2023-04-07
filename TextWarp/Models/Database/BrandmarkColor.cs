using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class BrandmarkColor
    {
        public int Id { get; set; }
        public string? IndexColor { get; set; }
        public string Color1 { get; set; } = null!;
        public string Color2 { get; set; } = null!;
        public string Color3 { get; set; } = null!;
        public string Color4 { get; set; } = null!;
        public string Color5 { get; set; } = null!;
    }
}
