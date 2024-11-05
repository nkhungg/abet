package abet.cse.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
public class FileUtil {
  public static void saveFile(String uploadDir, String fileName, MultipartFile multipartFile) {
    Path uploadPath = Paths.get(uploadDir);
    if (!Files.exists(uploadPath)) {
      try {
        Files.createDirectories(uploadPath);
      } catch (IOException e) {
        log.error("Could not create image directory", e);
      }
    }
    try (InputStream inputStream = multipartFile.getInputStream()) {
      Path filePath = uploadPath.resolve(fileName);
      Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException ioe) {
      log.error("Could not save image file: " + fileName, ioe);
    }
  }

  public static String saveFile(MultipartFile multipartFile, String parentFolder, String filename) {
    FileUtil.saveFile(parentFolder, filename, multipartFile);
    return filename;
  }

  public static String getFileExt(MultipartFile file) {
    String fileName = file.getOriginalFilename();
    return fileName.substring(fileName.indexOf("."));
  }

  public static File convertMultiPartToFile(MultipartFile file) throws IOException {
    File convFile = new File(file.getOriginalFilename());
    FileOutputStream fos = new FileOutputStream(convFile);
    fos.write(file.getBytes());
    fos.close();
    return convFile;
  }

  public static String getStringFromExcelCell(FormulaEvaluator formulaEvaluator, Cell cell) {
    String studentId = null;
    switch(formulaEvaluator.evaluateInCell(cell).getCellType().name()) {
      case "NUMERIC":
        Double doubleStudentId = cell.getNumericCellValue();
        studentId = String.format ("%.0f", doubleStudentId);
        break;
      case "STRING":
        studentId = String.valueOf(cell.getStringCellValue());
        break;
    }
    return studentId;
  }

  public static boolean removeFile(MultipartFile multipartFile) {
    File myObj = new File(multipartFile.getOriginalFilename());
    boolean result = myObj.delete();
    if (result) {
      log.info("Deleted the file: " + myObj.getName());
    } else {
      log.error("Failed to delete the file " + myObj.getName());
    }
    return result;
  }
}
