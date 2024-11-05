package abet.cse.controller;

import abet.cse.service.ImageResourceHandler;
import abet.cse.statics.Constant;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@RequestMapping("")
public class ImageController {

    @Resource
    private ImageResourceHandler imageResourceHandler;

    @GetMapping("/images/{fileName}")
    public void download(HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse, @PathVariable String fileName)
            throws ServletException, IOException {
        File file = new File(Constant.UPLOAD_DIR + fileName);
        httpServletRequest.setAttribute(Constant.ATTRIBUTE_FILE, file);
        imageResourceHandler.handleRequest(httpServletRequest, httpServletResponse);
    }

    @GetMapping(value = "/download/{imageName}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<StreamingResponseBody> downloadLog(@PathVariable String imageName)throws FileNotFoundException {
        InputStream inputStream = new FileInputStream(Constant.UPLOAD_DIR + imageName);
        StreamingResponseBody body = outputStream -> FileCopyUtils.copy(inputStream, outputStream);
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=" + imageName)
            .body(body);
    }
}