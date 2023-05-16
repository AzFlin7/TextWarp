using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class Twdesign
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Words { get; set; } = null!;
        public int StyleIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        public string MediaId { get; set; } = null!;
    }
}
