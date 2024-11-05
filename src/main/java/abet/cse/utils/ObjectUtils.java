package abet.cse.utils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.MessageOrBuilder;
import com.google.protobuf.util.JsonFormat;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ObjectUtils {

    private static final Gson gson;
    private static final Gson gsonSnakeCase;
    private static final JsonFormat.Printer PRINTER = JsonFormat.printer()
        .omittingInsignificantWhitespace().preservingProtoFieldNames();
    private static final Logger logger = LogManager.getLogger(ObjectUtils.class);


    public static String toJsonString(Object obj) {
        if (!(obj instanceof String)) {
            return gson.toJson(obj);
        }
        return (String) obj;
    }

    public static String toJsonStringSnakeCase(Object obj) {
        return gsonSnakeCase.toJson(obj);
    }

    public static String listToJson(Object objs, Type type) {
        return gson.toJson(objs, type);
    }

    public static <T> T fromJsonString(String sJson, Class<T> t) {
        return gson.fromJson(sJson, t);
    }

    public static <T> T fromJsonSnakeCase(String jsonSnakeCase, Class<T> t) {
        return gsonSnakeCase.fromJson(jsonSnakeCase, t);
    }

    public static String protobufToJson(MessageOrBuilder message) {
        try {
            return PRINTER.print(message);
        } catch (InvalidProtocolBufferException e) {
            logger.error("", e);
        }
        return null;
    }

    static {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        gsonBuilder.registerTypeAdapter(byte[].class, new TypeAdapter<byte[]>() {
            @Override
            public void write(JsonWriter out, byte[] value) throws IOException {
                out.value(Base64.getEncoder().encodeToString(value));
            }

            @Override
            public byte[] read(JsonReader in) throws IOException {
                return Base64.getDecoder().decode(in.nextString());
            }
        });
        gson = gsonBuilder.serializeNulls().disableHtmlEscaping().create();

        GsonBuilder snakeCaseGsonBuilder = new GsonBuilder();
        snakeCaseGsonBuilder.setDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        snakeCaseGsonBuilder.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES);
        snakeCaseGsonBuilder.registerTypeAdapter(byte[].class, new TypeAdapter<byte[]>() {
            @Override
            public void write(JsonWriter out, byte[] value) throws IOException {
                out.value(Base64.getEncoder().encodeToString(value));
            }

            @Override
            public byte[] read(JsonReader in) throws IOException {
                return Base64.getDecoder().decode(in.nextString());
            }
        });
        gsonSnakeCase = snakeCaseGsonBuilder.create();
    }
}
