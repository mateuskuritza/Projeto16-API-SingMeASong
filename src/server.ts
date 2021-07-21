import "./setup";
import app from "./app";

const port = process.env.PORT || 5444;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});

