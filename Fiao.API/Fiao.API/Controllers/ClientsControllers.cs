
using Fiao.API.Context;
using Fiao.API.Models.Dtos.ClientDto;
using Fiao.API.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fiao.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResponseClientDto>>> GetAll()
        {
            var clients = await _context.Clients
                .Select(c => new ResponseClientDto
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Apellido = c.Apellido,
                    Cedula = c.Cedula,
                    Telefono = c.Telefono,
                    Direccion = c.Direccion,
                    LimiteCredito = c.LimiteCredito,
                    SaldoActual = c.SaldoActual,
                    Activo = c.Activo
                })
                .ToListAsync();

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseClientDto>> GetById(int id)
        {
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id);

            if (client == null)
                return NotFound(new { message = "Cliente no encontrado." });

            var response = new ResponseClientDto
            {
                Id = client.Id,
                Nombre = client.Nombre,
                Apellido = client.Apellido,
                Cedula = client.Cedula,
                Telefono = client.Telefono,
                Direccion = client.Direccion,
                LimiteCredito = client.LimiteCredito,
                SaldoActual = client.SaldoActual,
                Activo = client.Activo
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseClientDto>> Create(CreateClientDto createClient)
        {
            var client = new Client
            {
                Nombre = createClient.Nombre,
                Apellido = createClient.Apellido,
                Cedula = createClient.Cedula,
                Telefono = createClient.Telefono,
                Direccion = createClient.Direccion,
                LimiteCredito = createClient.LimiteCredito
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            var response = new ResponseClientDto
            {
                Id = client.Id,
                Nombre = client.Nombre,
                Apellido = client.Apellido,
                Cedula = client.Cedula,
                Telefono = client.Telefono,
                Direccion = client.Direccion,
                LimiteCredito = client.LimiteCredito,
                SaldoActual = client.SaldoActual,
                Activo = client.Activo
            };

            return CreatedAtAction(nameof(GetById), new { id = client.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateClientDto updateClient)
        {
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id);

            if (client == null)
                return NotFound(new { message = "Cliente no encontrado." });

            client.Nombre = updateClient.Nombre;
            client.Apellido = updateClient.Apellido;
            client.Cedula = updateClient.Cedula;
            client.Telefono = updateClient.Telefono;
            client.Direccion = updateClient.Direccion;
            client.LimiteCredito = updateClient.LimiteCredito;
            client.Activo = updateClient.Activo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id);

            if (client == null)
                return NotFound(new { message = "Cliente no encontrado." });

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cliente eliminado correctamente." });
        }
    }
}
