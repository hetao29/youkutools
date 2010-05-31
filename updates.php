<?php
if(!empty($_REQUEST['x'])){
	parse_str($_REQUEST['x'],$tmp);
	$id=$tmp['id'];
}
$id = !empty($id)?$id:"mingfkcljlkppmpldbfnplmhgamieemm";
echo "<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='$id'>
    <updatecheck codebase='http://localhost/chrome_youku/chrome_youku.crx' version='2.0' />
  </app>
</gupdate>";