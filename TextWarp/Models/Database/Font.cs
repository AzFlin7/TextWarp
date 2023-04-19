using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Font
    {
        public int Id { get; set; }
        public string Family { get; set; } = null!;
        public bool DeleteFlag { get; set; }
        public bool Modern { get; set; }
        public bool Vintage { get; set; }
        public bool Elegant { get; set; }
        public bool Playful { get; set; }
        public bool Handwritten { get; set; }
        public bool Monogram { get; set; }
        public bool Serif { get; set; }
        public bool SansSerif { get; set; }
        public bool Rounded { get; set; }
        public bool Script { get; set; }
        public bool Decorative { get; set; }
        public bool Stencil { get; set; }
        public bool? Title { get; set; }
        public bool? InitShow { get; set; }
    }
}
