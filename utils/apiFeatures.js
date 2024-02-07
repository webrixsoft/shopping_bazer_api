class APIFeatures {
        constructor(query, queryString) {
                this.query = query;
                this.queryString = queryString;
        }

        filter() {
                const queryObj = { ...this.queryString };
                const excludedFields = ['page', 'sort', 'limit', 'fields'];
                excludedFields.forEach(el => delete queryObj[el]);

                // 1B) Advanced filtering
                let queryStr = JSON.stringify(queryObj);
                // console.log(queryStr)
                queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
                // console.log(queryStr)
                this.query = this.query.find(JSON.parse(queryStr));

                return this;
        }

        search() {
                let search_val = '';
                const queryObj = { ...this.queryString };
                const excludedFields = ['page', 'sort', 'limit', 'fields'];
                excludedFields.forEach(el => delete queryObj[el]);

                // 1B) Advanced filtering
                let queryStr = JSON.stringify(queryObj);
                // console.log(excludedFields)
                queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
                //console.log(queryObj.search)

                var searchDaynmic = {};
                searchDaynmic[queryObj.search] = new RegExp(queryObj.value, "i");

                search_val = queryObj.search;
                let value = queryObj.value;
                this.query = this.query.find(searchDaynmic);
                return this;
        }



        sort() {
                if (this.queryString.sort) {
                        const sortBy = this.queryString.sort.split(',').join(' ');
                        this.query = this.query.sort(sortBy);
                } else {
                        this.query = this.query.sort('-created_at');
                }

                return this;
        }

        limitFields() {
                if (this.queryString.fields) {
                        const fields = this.queryString.fields.split(',').join(' ');
                        this.query = this.query.select(fields);
                } else {
                        this.query = this.query.select('-__v');
                }

                return this;
        }

        paginate() {
                var page = this.queryString.page * 1 || 1;
                const limit = this.queryString.limit * 1 || 100;
                const skip = (page - 1) * limit;
                this.query = this.query.skip(skip).limit(limit);

                return this;
        }
}
module.exports = APIFeatures;