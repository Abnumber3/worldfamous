using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public sealed class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly StoreContext _context;
        private readonly Dictionary<Type, object> _repositories = new();

        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            var type = typeof(TEntity);

            if (!_repositories.TryGetValue(type, out var repo))
            {
                // Prefer direct construction to Activator for perf + compile-time safety
                repo = new GenericRepository<TEntity>(_context);
                _repositories[type] = repo;
            }

            return (IGenericRepository<TEntity>)repo;
        }
    }
}
