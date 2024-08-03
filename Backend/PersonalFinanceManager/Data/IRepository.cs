using System.Linq;
using System.Threading.Tasks;

namespace PersonalFinanceManager.Data
{
    public interface IRepository<T>
    {
        Task<IQueryable<T>> GetAllAsync();
        Task<T> GetByIdAsync(Guid id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
    }
}
