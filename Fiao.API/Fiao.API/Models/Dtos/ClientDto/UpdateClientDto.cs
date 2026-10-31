using System.ComponentModel.DataAnnotations;

namespace Fiao.API.Models.Dtos.ClientDto
{
    public class UpdateClientDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres.")]
        public string Apellido { get; set; } = string.Empty;

        [Required(ErrorMessage = "La cédula es obligatoria.")]
        [StringLength(13, MinimumLength = 13, ErrorMessage = "La cédula debe contener exactamente 11 dígitos.")]
        public string Cedula { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres.")]
        public string? Telefono { get; set; }

        [StringLength(200, ErrorMessage = "La dirección no puede exceder los 200 caracteres.")]
        public string? Direccion { get; set; }

        [Required(ErrorMessage = "El límite de crédito es obligatorio.")]
        public decimal LimiteCredito { get; set; }
        public bool Activo { get; set; } = true;

    }
}
