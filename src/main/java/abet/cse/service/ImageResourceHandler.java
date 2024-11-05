package abet.cse.service;

import abet.cse.statics.Constant;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;
import javax.servlet.http.HttpServletRequest;
import java.io.File;

@Component
public class ImageResourceHandler extends ResourceHttpRequestHandler {

    @Override
    protected Resource getResource(HttpServletRequest request) {
        File file = (File) request.getAttribute(Constant.ATTRIBUTE_FILE);
        return new FileSystemResource(file);
    }
}