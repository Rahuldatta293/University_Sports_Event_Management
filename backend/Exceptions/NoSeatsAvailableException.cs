namespace Backend.Exceptions;

public class NoSeatsAvailableException : Exception
{
    public NoSeatsAvailableException()
        : base("No seats available for this event.")
    {
    }

    public NoSeatsAvailableException(string message)
        : base(message)
    {
    }

    public NoSeatsAvailableException(string message, Exception inner)
        : base(message, inner)
    {
    }
}