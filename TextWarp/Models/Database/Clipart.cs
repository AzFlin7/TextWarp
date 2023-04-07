using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Clipart
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string SubTitle { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
