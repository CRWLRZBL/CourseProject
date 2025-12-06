using CourseProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CourseProjectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IPdfReportService _pdfReportService;

        public ReportsController(IPdfReportService pdfReportService)
        {
            _pdfReportService = pdfReportService;
        }

        [HttpGet("sales/export")]
        public async Task<IActionResult> ExportSalesReportPdf(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] int? brandId,
            [FromQuery] string period = "custom")
        {
            try
            {
                DateTime start, end;

                // Определяем период на основе параметра
                switch (period.ToLower())
                {
                    case "month":
                        start = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                        end = DateTime.Now;
                        break;
                    case "year":
                        start = new DateTime(DateTime.Now.Year, 1, 1);
                        end = DateTime.Now;
                        break;
                    default:
                        start = startDate ?? DateTime.Now.AddMonths(-1);
                        end = endDate ?? DateTime.Now;
                        break;
                }

                var pdfBytes = await _pdfReportService.GenerateSalesReportPdfAsync(start, end, brandId);

                var fileName = $"sales_report_{start:yyyy-MM-dd}_{end:yyyy-MM-dd}.pdf";
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}

