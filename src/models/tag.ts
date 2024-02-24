import mongoose from "mongoose";

interface ITag {
    label: string;
    color: string;
}

interface ITagModel extends mongoose.Model<ITagDoc> {
    build(attrs: ITag): ITagDoc;
}

interface ITagDoc extends mongoose.Document {
    label: string;
    color: string;
}


const tagSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

tagSchema.statics.build = (attrs: ITag) => {
    return new Tag(attrs);
};

const Tag = mongoose.model<ITagDoc, ITagModel>('Tag', tagSchema);

export { Tag };