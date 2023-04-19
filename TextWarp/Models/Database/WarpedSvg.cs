using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class WarpedSvg
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string? SvgfileName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string WorkName { get; set; } = null!;
        public string Words { get; set; } = null!;
        public int StyleIndex { get; set; }
        public int Version { get; set; }
    }
}
