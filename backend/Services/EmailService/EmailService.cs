using MailKit.Net.Smtp;
using MimeKit;

namespace Backend.Services.EmailService;

public class EmailService : IEmailService
{
    public void SendEmail(string to, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Rahul Datta", "bitrarahuldatta@gmail.com"));
        email.To.Add(new MailboxAddress("", to));
        email.Subject = subject;
        email.Body = new TextPart("plain") { Text = body };

        using var client = new SmtpClient();

        client.Connect("smtp.gmail.com", 587, false);
        client.Authenticate("bitrarahuldatta@gmail.com", "djwwhatghemregnh");
        client.Send(email);
        client.Disconnect(true);
    }

    public async Task SendMailAsync(string to, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Rahul Datta", "bitrarahuldatta@gmail.com"));
        email.To.Add(new MailboxAddress("", to));

        email.Subject = subject;
        email.Body = new TextPart("plain") { Text = body };

        using var client = new SmtpClient();

        await client.ConnectAsync("smtp.gmail.com", 587, false);
        await client.AuthenticateAsync("bitrarahuldatta@gmail.com", "djwwhatghemregnh");
        await client.SendAsync(email);
        await client.DisconnectAsync(true);
    }
}