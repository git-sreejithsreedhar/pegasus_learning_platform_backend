import { Model, FilterQuery } from 'mongoose';

export async function mongoPagePaginate<T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  page = 1,
  limit = 10,
) {
  const minPage = Math.max(page, 1);
  const minLimit = Math.min(Math.max(limit, 1), 100);

  const skip = (minPage - 1) * minLimit;

  const [items, totalItems] = await Promise.all([
    model
      .find(filter)
      .skip(skip)
      .limit(minLimit)
      .sort({ createdAt: -1 })
      .exec(),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / minLimit);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: minPage,
    limit: minLimit,
  };
}
