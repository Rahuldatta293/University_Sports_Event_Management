namespace Backend.Services.EmailService;

public interface IEmailService
{
    void SendEmail(string to, string subject, string body);
    Task SendMailAsync(string to, string subject, string body);
}