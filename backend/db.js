import mongoose from 'mongoose';
const Schema=mongoose.Schema;
import objectId from 'mongoose';

const user=new Schema(
    {
        "name":String,
        "email":String,
        "password":String,
    }
)

const todo=new Schema(
    {
        "title":String,
        "description":String,
        "userId":{
            type:Schema.Types.ObjectId, ref:'users',
        },
        "done":Boolean,
    }
)

const userModel=mongoose.model('users',user);
const todoModel=mongoose.model('todos',todo);


export { userModel, todoModel };