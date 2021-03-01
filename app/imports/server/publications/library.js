import SimpleSchema from 'simpl-schema';
import Libraries from '/imports/api/library/Libraries.js';
import LibraryNodes from '/imports/api/library/LibraryNodes.js';
import { assertViewPermission } from '/imports/api/sharing/sharingPermissions.js';
const standardLibraryIds = [
  'SRDLibraryGA3XWsd',
];

Meteor.publish('standardLibraries', function(){
  return Libraries.find({_id: {$in: standardLibraryIds}});
});

Meteor.publish('libraries', function(){
  this.autorun(function (){
    let userId = this.userId;
    if (!userId) {
      return [];
    }
    const user = Meteor.users.findOne(userId, {
      fields: {subscribedLibraries: 1}
    });
    const subs = user && user.subscribedLibraries || [];
    return Libraries.find({
      $or: [
        {owner: this.userId},
        {writers: this.userId},
        {readers: this.userId},
        {_id: {$in: subs}},
      ]
    });
  });
});

let libraryIdSchema = new SimpleSchema({
  libraryId:{
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

Meteor.publish('libraryNodes', function(libraryId){
  if (!libraryId) return [];
  libraryIdSchema.validate({libraryId});
  this.autorun(function (){
    let userId = this.userId;
    let library = Libraries.findOne(libraryId);
    try { assertViewPermission(library, userId) }
    catch(e){
      return this.error(e);
    }
    return [
      LibraryNodes.find({
        'ancestors.id': libraryId,
      }, {
        sort: {order: 1},
      }),
    ];
  });
});
