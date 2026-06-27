class ETLJob:

    def __init__(
        self,
        reader,
        validator,
        transformer,
        writer
    ):

        self.reader = reader
        self.validator = validator
        self.transformer = transformer
        self.writer = writer

    def run(self):

        for row in self.reader.read():

            if self.validator.validate(row):

                transformed = self.transformer.transform(row)

                self.writer.write(transformed)