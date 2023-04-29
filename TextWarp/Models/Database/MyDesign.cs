using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class MyDesign
    {
        public int Id { get; set; }
        public string SvgfileName { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string Words { get; set; } = null!;
        public int StyleIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        public string MediaId { get; set; } = null!;
    }
}
