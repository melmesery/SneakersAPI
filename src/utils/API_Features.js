class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }

  paginate() {
    let { page, size } = this.queryData;
    if (!page || page <= 0) {
      page = 1;
    }
    if (!size || size <= 0) {
      size = 3;
    }
    this.mongooseQuery
      .limit(parseInt(size))
      .skip((parseFloat(page) - 1) * parseInt(size));
    return this;
  }

  filter() {
    const excludeQueryParams = ["page", "size", "sort", "search", "fields"];

    const filterQuery = { ...this.queryData };

    excludeQueryParams.forEach((param) => {
      delete filterQuery[param];
    });

    const filtering = JSON.parse(
      JSON.stringify(filterQuery).replace(
        /(gt|gte|lt|lte|in|nin|eq|neq)/g,
        (match) => `$${match}`
      )
    );

    this.mongooseQuery.find(filtering);

    return this;
  }

  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "));
    return this;
  }

  search() {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: `${this.queryData.search}`, $options: "i" } },
          {
            description: { $regex: `${this.queryData.search}`, $options: "i" },
          },
        ],
      });
    }
    return this;
  }

  select() {
    this.mongooseQuery.select(this.queryData.fields?.replaceAll(",", " "));
    return this;
  }
}

export default ApiFeatures;
