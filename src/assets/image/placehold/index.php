<?php
define('DS', DIRECTORY_SEPARATOR);
define('FONT_PATH', dirname(__FILE__).DS."fonts/");
define('BG_PATH', dirname(__FILE__).DS."bg/");

$path = '';
$bg_type = (isset($_POST['bg_type'])) ? $_POST['bg_type'] : 'resize';
$bg_image = (isset($_POST['bg_image'])) ? $_POST['bg_image'] : '';
$bg_color = (isset($_POST['bg_color'])) ? $_POST['bg_color'] : 'cccccc';
$txt_color = (isset($_POST['txt_color'])) ? $_POST['txt_color'] : '969696';
if(isset($_POST['path'])) {
	
	$path = $_POST['path'];
	$new_path = newFolder($path);
    
	$msg = "";
	
	$fontPath = FONT_PATH;
	if(!is_dir($path)) {
		$msg = "Path is incorrect!";
	} else {
		$files = jaFiles($path, "\.(jpg|png|jpeg|gif)$", true, true);
		
		if(count($files)) {
			
			$bgCode = jaGetColorCode($bg_color);
			$txtCode = jaGetColorCode($txt_color);
			foreach ($files as $file) {
				/*$fileBak = $file."_bak";
				rename($file, $fileBak);*/
				$new_file = str_replace($path, $new_path, $file['path']);
                $oldfile = $file['path'];
				list($width, $height, $type, $attr) = getimagesize($oldfile);
				$ext = jaGetFileExt($oldfile);
				
				$im = imagecreatetruecolor($width, $height);
				//white background
				$bgColor = imagecolorallocate($im, $bgCode[0], $bgCode[1], $bgCode[2]);
				imagefilledrectangle($im, 0, 0, $width, $height, $bgColor);
				//image background
				if(!empty($bg_image)) {
					jaApplyBackground($im, $width, $height, BG_PATH.$bg_image, $bg_type);
				}
				//text color: black
				$txtColor = imagecolorallocate($im, $txtCode[0], $txtCode[1], $txtCode[2]);
				//main text
				$maininfo = "{$width}x{$height}";
				$filename = basename($oldfile);
				
				$txtInfo = jaGetCenterPos($maininfo, $width, $height, 'arial', $fontPath);
				imagestring($im, $txtInfo['font'], $txtInfo['left'], $txtInfo['top'],  $maininfo, $txtColor);
				
				switch ($ext) {
					case 'gif': imagegif($im, $new_file); break;
					case 'png': imagepng($im, $new_file); break;
					case 'jpg': 
					case 'jpeg': 
						imagejpeg($im, $new_file); break;
				}
				imagedestroy($im);
				
				$msg .= "Successfully create image {$new_file}<br />";
			}
		}
	}
	
	
}

function newFolder($path, $createNewFolder = true){
    if(!$path)
        return '';
    $parts = explode(DS, trim($path, DS));
    $foler_name = array_pop($parts);
    $new_path = implode(DS, $parts).DS.$foler_name.'_placeholder';
    if(!is_dir($new_path) && $createNewFolder)
        mkdir($new_path);
    return $new_path;
}

##########################GENERAL FUNCTIONS##################################
function jaGetColorCode($color) {
	//convert from css color style to RGB code
	$R = hexdec(substr($color, 0, 2));
	$G = hexdec(substr($color, 2, 2));
	$B = hexdec(substr($color, 4, 2));
	return array($R, $G, $B);
}
function jaGetCenterPos($str, $imgWidth, $imgHeight, $fontFace = 'arial', $fontPath = '') {
	$fontPath = jaCleanPath($fontPath."/{$fontFace}/", DS);
	
	$useFont = !empty($fontFace); //use custom font or not?
	
	if($useFont && !is_dir($fontPath)) {
		$useFont = false;
	}
	
	if($useFont) {
		$numSize = count(jaFiles($fontPath, "\.gdf$"));
		if(!$numSize) {
			$useFont = false;
		}
	}
	//auto detect font size depend on image size and string that given
	$txtLen = strlen($str);
	
	if($useFont) {
		$fontSize = $numSize+1;
	} else {
		//Default font
		//Can be 1, 2, 3, 4, 5 for built-in fonts in latin2 encoding 
		$fontSize = 5+1;
	}
	
	do {
		$fontSize--;
		if($useFont) {
			$font = imageloadfont($fontPath."{$fontSize}.gdf");
		} else {
			$font = $fontSize;
		}
		$txtWidth = $txtLen * imagefontwidth($font);
	} while ($txtWidth > $imgWidth && $fontSize > 1);
	
	$txtHeight = imagefontheight($font);
	
	$left = ($txtWidth > $imgWidth) ? 0 : floor(($imgWidth - $txtWidth)/2);
	$top = ($txtHeight > $imgHeight) ? 0 : floor(($imgHeight - $txtHeight)/2);
	
	$aData = array(
		'top' => $top,
		'left' => $left,
		'font' => $font,
		'fsize' => $fontSize,
		'fwidth' => imagefontwidth($fontSize),
		'fheight' => imagefontheight($fontSize),
	);
	return $aData;
}
/**
 * apply background image
 *
 * @param (image resource) $im
 * @param int $width - width of dest image
 * @param int $height - height of dest image
 * @param string $bgimage - path to background image
 */
function jaApplyBackground(&$im, $width, $height, $bgimage, $bg_type = 'resize') {
	if(!is_file($bgimage)) return false;
	$ext = jaGetFileExt($bgimage);
	switch ($ext) {
		case 'gif': $imBg = imagecreatefromgif($bgimage); break;
		case 'png': $imBg = imagecreatefrompng($bgimage); break;
		case 'bmp': 
		case 'wbmp': 
			$imBg = imagecreatefromwbmp($bgimage); break;
		case 'jpg': 
		case 'jpeg': 
			$imBg = imagecreatefromjpeg($bgimage); break;
	}
	if(!isset($imBg)) {
		//unsupported format
		return false;
	}
	list($bgWidth, $bgHeight, $bgType, $bgAttr) = getimagesize($bgimage);
	
	if($bg_type == 'crop') {
		imagecopyresized($im, $imBg, 0, 0, 0, 0, $bgWidth, $bgHeight, $bgWidth, $bgHeight);
	} else {
		//Get the scale of image
		$scaleW = $width/$bgWidth;
		$scaleH = $height/$bgHeight;
		
		$dstW = $bgWidth;
		$dstH = $bgHeight;
		if($scaleW > 1 && $scaleH > 1) {
			//background < image
			$bgLeft = 0;
			$bgTop = 0;
		} elseif ($scaleW > 1) {
			//width of bg image < width of dst image
			//height of bg image > height of dst image
			$dstH = $height;
			$dstW = $width * $scaleH;
		} elseif ($scaleH > 1) {
			//width of bg image > width of dst image
			//height of bg image < height of dst image
			$dstW = $width;
			$dstH = $height * $scaleW;
		} else {
			//background > image
			$scale = min($scaleW, $scaleH);
			$dstW = $scale * $bgWidth;
			$dstH = $scale * $bgHeight;
			
		}
		$left = floor(($width-$dstW)/2);
		$top = floor(($height-$dstH)/2);
		imagecopyresized($im, $imBg, $left, $top, 0, 0, $dstW, $dstH, $bgWidth, $bgHeight);
	}

	imagedestroy($imBg);
}

function jaGetFileExt($file) {
	$ext = strtolower(substr($file, strrpos($file, '.')+1));
	return $ext;
}

function jaCleanPath($path, $ds=DS) {
	$path = trim($path);
	// Remove double slashes and backslahses and convert all slashes and backslashes to DS
	$path = preg_replace('#[/\\\\]+#', $ds, $path);
	return $path;
}

function jaFiles($path, $filter = '.', $recurse = false, $fullpath = false, $exclude = array('.svn', 'CVS'), $createNewFolder = true)
{
	$exclude[] = '.svn';
	$exclude[] = '.git';
	$exclude[] = 'CVS';
	
	$exclude = array_unique($exclude);
	
	$path = jaCleanPath($path.DS);
	
	//die("400|".print_r($exclude, true));
	$basePath = newFolder($path, $createNewFolder);
	$arr = _jaFiles($path, $basePath, $filter, $recurse, $fullpath, $exclude, $createNewFolder);
	if(!$arr) {
		$arr = array();
	}
	return $arr;
}

function _jaFiles($path, $basePath, $filter = '.', $recurse = false, $fullpath = false, $exclude = array('.svn', 'CVS'), $createNewFolder = true)
{
	// Initialize variables
	$arr = array();

	// Check to make sure the path valid and clean
	$path = jaCleanPath($path);

	// Is the path a folder?
	if (!is_dir($path)) {
		JError::raiseWarning(21, '_jaFiles: ' . JText::_('Path is not a folder'), 'Path: ' . $path);
		return false;
	}

	// read the source directory
	$handle = opendir($path);
	while (($file = readdir($handle)) !== false)
	{
		if (($file != '.') && ($file != '..') && (!in_array($file, $exclude))) {
			$dir = jaCleanPath($path . DS . $file);
			$isDir = is_dir($dir);
			if ($isDir) {
				if ($recurse) {
                    $basePath_new = $basePath . DS . $file;
                    if(!is_dir($basePath_new) && $createNewFolder)
                        mkdir($basePath_new);
                    
					if (is_integer($recurse)) {
						$arr2 = _jaFiles($dir, $basePath_new, $filter, $recurse - 1, $fullpath, $exclude);
					} else {
						$arr2 = _jaFiles($dir, $basePath_new, $filter, $recurse, $fullpath, $exclude);
					}
					
					$arr = array_merge($arr, $arr2);
				}
			} else {
				if (preg_match("/$filter/i", $file)) {
					if ($fullpath) {
						$arr[] = array('new_path' => $basePath, 'path' => $dir);
					} else {
						$arr[] = array('new_path' => $basePath, 'path' => $file);
					}
				}
			}
		}
	}
	closedir($handle);

	asort($arr);
	return $arr;
}
?>

<?php
$aBgFiles = jaFiles(BG_PATH, "\.(jpg|jpeg|gif|png|bmp|wbmp)$", false, false, array('.svn', 'CVS'), false);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magentech Creative Placehold Image</title>
<style type="text/css">
#result {
	padding:10px 20px; 
	border:1px dashed #CC6600; 
	line-height:18px;
}
.group {
	font-weight:bold; 
	color:red; 
	padding: 3px 5px;
}
.title {
	color: blue;
}
</style>
<script type="text/javascript" src="assets/jscolor/jscolor.js"></script>
</head>

<body>
<form action="" method="post" enctype="multipart/form-data">
<span class="group">Image Path</span>:
<input type="text" name="path" value="<?php echo $path; ?>" size="80" />
<br />
<span class="group">Background:</span>
<span class="title">Color</span> <input type="text" name="bg_color" class="color" value="<?php echo $bg_color; ?>" />
<span class="title">Image</span>
<select name="bg_image">
<option value="">--Select--</option>
<?php if(count($aBgFiles)): ?>
<?php foreach ($aBgFiles as $bg): ?>
<option value="<?php echo $bg['path']; ?>" <?php if($bg['path'] == $bg_image) {echo 'selected="selected"';} ?>><?php echo $bg['path']; ?></option>
<?php endforeach; ?>
<?php endif; ?>
</select>
<span class="title">Position</span>
<input type="radio" name="bg_type" value="resize" id="bg_type_resize" <?php if($bg_type == 'resize') {echo 'checked="checked"';} ?> /> <label for="bg_type_resize">Center</label>
<input type="radio" name="bg_type" value="crop" id="bg_type_crop" <?php if($bg_type == 'crop') {echo 'checked="checked"';} ?> /> <label for="bg_type_crop">Fill</label>

<span class="group">Text Color:</span><input type="text" name="txt_color" class="color" value="<?php echo $txt_color; ?>" />
<input type="submit" name="btnSubmit" value="Submit" />
</form>
<?php if(isset($msg) && !empty($msg)): ?>
<div id="result">
<?php echo $msg; ?>
</div>
<?php endif; ?>
</body>
</html>