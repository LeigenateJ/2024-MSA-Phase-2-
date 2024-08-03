using System.ComponentModel.DataAnnotations;

public class UpdateUserDto
{
    public string Username { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    public string Email { get; set; }

    public string Role { get; set; }
}
