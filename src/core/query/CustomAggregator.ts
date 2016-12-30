
 export interface ICustomAggregator {
   getAggregationPath():Array<any>|String
   getAggregations(fieldContext, ...aggregations):any[]
 }

export class CustomAggregator<ICustomAggregator> {
    constructor(public path:any, public aggregator:any) {
      this.path = path;
      this.aggregator = aggregator;
    }

    getAggregationPath() {
        return this.path;
    }

    getAggregations(fieldContext, ...aggregations) {
        return this.aggregator(fieldContext, ...aggregations);
    }
}