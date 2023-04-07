using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class WarppedSvg
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? SvgfileName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? WorkName { get; set; }
    }
}
