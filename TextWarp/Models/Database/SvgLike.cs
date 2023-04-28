using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class SvgLike
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string SvgfileName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string Words { get; set; } = null!;
        public int StyleIndex { get; set; }
    }
}
