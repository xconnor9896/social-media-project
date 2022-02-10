import { Form, Header, Icon, Image, Segment } from "semantic-ui-react";

const DragNDrop = ({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  media,
  mediaPreview,
  setMediaPreview,
}) => {
  return (
    <>
      <Form.Field>
        <Segment {...(highlighted && { color: "green" })} placeholder basic secondary>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
          />
          <div
            style={{ cursor: "pointer" }}
            onDragOver={(e) => {
              e.preventDefault();
              setHighlighted(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setHighlighted(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setHighlighted(true);

              // console.log(e.dataTransfer.files);

              const droppedFile = e.dataTransfer.files[0];
              setMediaPreview(droppedFile);
              setMediaPreview(URL.createObjectURL(droppedFile));
            }}

            onClick={() => inputRef.current.click()}
          >
            {mediaPreview === null ? (<>
              <Segment placeholder basic>
                <Header icon>
                  <Icon name="file image outline" />
                  Drag and drop profile picture here
                </Header>
              </Segment>
            </>) : (<>
              <Segment placeholder basic>
                <Image
                  src={mediaPreview}
                  size="medium"
                  centered
                  style={{ cursor: "pointer" }}
                // onClick={() => inputRef.current.click()} we might not need this!
                />
              </Segment>
            </>)}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
};

export default DragNDrop;
