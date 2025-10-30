// import { activitiesFeatureKey } from "../reducers/activities.reducers";
// import { selectActivities, selectActivitiesDate, selectActivitiesLoading, selectActivitiesState } from "./activities.selectors";

// describe('Activities Selectors', () => {

//   it('should select activities state', () => {
//     let result = selectActivitiesState({
//       [activitiesFeatureKey]: {
//         data: []
//       }
//     });
//     expect(result).toEqual({ data: [] });
//   });

//   // it('should select activities loading', () => {
//   //   let result = selectActivitiesLoading({[activitiesFeatureKey]: {
//   //     loading: true
//   //   }});
//   //   expect(result).toBeTrue();
//   //   result = selectActivitiesLoading({[activitiesFeatureKey]: {loading: false}});
//   //   expect(result).toBeFalse();
//   //   result = selectActivitiesLoading({[activitiesFeatureKey]: undefined});
//   //   expect(result).toBeFalse();
//   // });

//   // it('should select activities', () => {
//   //   let result = selectActivities({
//   //     [activitiesFeatureKey]: {
//   //       data: [{ date: '2022-01-01', activities: [{ name: 'running', calories: 123 }] }]
//   //     }
//   //   });
//   //   expect(result).toEqual([{ date: '2022-01-01', activities: [{ name: 'running', calories: 123 }] }]);
//   // });

//   // it('should select activities for date', () => {
//   //   let result = selectActivitiesDate('2022-01-01')({
//   //     [activitiesFeatureKey]: {
//   //       data: [{ date: '2022-01-01', activities: [{ name: 'running' }] }]
//   //     }
//   //   });
//   //   expect(result).toEqual([{ name: 'running' }]);
//   //   result = selectActivitiesDate('2022-01-01')({
//   //     [activitiesFeatureKey]: {
//   //       data: [{ date: '2022-01-02', activities: [{ name: 'running' }] }]
//   //     }
//   //   });
//   //   expect(result).toBeUndefined();
//   //   result = selectActivitiesDate('2022-01-01')({
//   //     [activitiesFeatureKey]: {
//   //       data: undefined
//   //     }
//   //   });
//   //   expect(result).toBeUndefined();
//   // });
// });
