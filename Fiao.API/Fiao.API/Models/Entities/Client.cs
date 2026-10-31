
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fiao.API.Models.Entities
{
    public class Client
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Required]
        [StringLength(13, MinimumLength = 13)]
        public string Cedula { get; set; } = string.Empty;

        [StringLength(15)]
        public string? Telefono { get; set; }

        [StringLength(200)]
        public string? Direccion { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal LimiteCredito { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SaldoActual { get; set; } = 0;

        public bool Activo { get; set; } = true;
    }
}