using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class SendToApparel
    {
        public int Id { get; set; }
        public string MediaId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        /// <summary>
        /// 1: TW 2: TB
        /// </summary>
        public byte Type { get; set; }
    }
}
