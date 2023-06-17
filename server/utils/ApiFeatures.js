class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const fieldToBeExclude = ["page", "sort", "limit", "fields", "keyword"];
    let queryObj = { ...this.queryStr };
    fieldToBeExclude.forEach((field) => {
      delete queryObj[field];
    });
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryObj));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const str = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(str);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  pagination(totalDoc) {
    // console.log("total->", totalDoc);
    const limit = this.queryStr.limit * 1 || 100;
    const page = this.queryStr.page * 1 || 1;

    const skip = (page - 1) * limit;
    if (skip > totalDoc) throw new Error("page does not exists");
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};
    this.query = this.query.find(keyword);
    return this;
  }
}

export default ApiFeatures;
