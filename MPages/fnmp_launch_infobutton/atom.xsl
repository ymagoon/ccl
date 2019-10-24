<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:a="http://www.w3.org/2005/Atom"
  xmlns:xhtml="http://www.w3.org/1999/xhtml" 
  xmlns="http://www.w3.org/1999/xhtml" 
  exclude-result-prefixes="a xhtml"> 
 
<!--"-//W3C//DTD XHTML 1.0 Transitional//EN"
""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>"-->

  <xsl:output method="html" encoding="utf-8"
              doctype-public="-//W3C//DTD XHTML 1.1//EN"
			  media-type="application/xhtml+xml"
			  indent="no"
			  omit-xml-declaration="yes"
              doctype-system="http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"/>

  <xsl:template match="*"/><!-- Ignore unknown elements -->
  <xsl:template match="*" mode="links"/>
  <xsl:template match="*" mode="categories"/>

  <xsl:template match="a:feed">
	<html xml:lang="en">
	  <head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><xsl:value-of select="a:title"/></title>
	  </head>
	  <body style="font-family:Arial;font-size:11pt"> <!--;background-color:#EEEEEE-->
<!--		<h1><xsl:apply-templates select="a:title" mode="text-construct"/></h1>
		<xsl:apply-templates select="a:subtitle" mode="text-consstruct"/>
		<xsl:variable name="vDateTime" 
             select="a:updated"/>
		<xsl:variable name="vDateOnly" 
             select="substring-before($vDateTime,'T')"/>
		 <div class="Updated">
			<xsl:text>Updated: </xsl:text> <xsl:value-of select="$vDateOnly"/>
		 </div>
		<div class="categories">
			<p> Categories: </p>
			<xsl:apply-templates select="a:category" mode="categories"/>
		</div> -->
		<h2><xsl:apply-templates select="a:title" mode="text-construct"/></h2>
		<!--<xsl:apply-templates select="a:entry/a:summary"/>-->

		<xsl:apply-templates select="a:entry"/>
		<!--<xsl:apply-templates select="a:author"/>-->
	  </body>
	</html>
  </xsl:template>
  
 <!--
  <xsl:template match="a:content">
    <div class="content">
      <xsl:apply-templates select="." mode="text-construct"/>
    </div>
  </xsl:template>
-->
  <xsl:template match="a:entry">
    <div class="entry">
      <h4><xsl:apply-templates select="a:title" mode="text-construct"/></h4>
<!--      <div class="id">Entry ID: <xsl:value-of select="a:id"/></div>-->
 		<xsl:apply-templates select="a:summary"/>
 		<xsl:apply-templates select="a:content"/>
<!--		<xsl:variable name="vDateTime" 
             select="a:updated"/>
		<xsl:variable name="vDateOnly" 
             select="substring-before($vDateTime,'T')"/>

		<div class="updated">Entry updated: <xsl:value-of select="$vDateOnly"/></div>-->
		<div class="links">
				<xsl:apply-templates select="a:link" mode="links"/>
		</div>

<!--		<div class="categories">
			<xsl:text>Categories: </xsl:text>
			<xsl:apply-templates select="a:category" mode="categories"/>
		</div> -->
	</div>

  </xsl:template>
  
 <xsl:template match="a:entry/a:summary">
	
    <div class="summary">
<!--	 <xsl:text>In summary block </xsl:text> -->
	  <xsl:if test="node()" > 
 		<h4>Summary: </h4> <xsl:value-of select="node()" disable-output-escaping = "yes"/>
		</xsl:if>
	</div>

	
  </xsl:template>
  <xsl:template match="a:entry/a:content">
	
    <div class="content">
<!--	 <xsl:text>In summary block </xsl:text> -->
	  <xsl:if test="node()" > 
 		<h4>Content: </h4> <xsl:copy-of select="node()"/>
		</xsl:if>
	</div>

	
  </xsl:template>

 <xsl:template match="a:author">
 <h4>
    <div class="NameAndUri">Author: <xsl:value-of select="a:name"/>
		<xsl:text> - </xsl:text>
		<xsl:value-of select="a:uri"/>
	</div>
	</h4>
</xsl:template>

<xsl:template match="a:link" mode="links">
 
	<xsl:variable name="hrefpath" select="@href" />
 	<xsl:variable name="hreftype" select="@type" />
 
	<a target = "_parent" onclick="((window.parent).GetIFrameLink('{$hrefpath}')); return false;" href="#" >
	<xsl:choose>
	<xsl:when test="@type">
		<p><xsl:text>Type: </xsl:text><xsl:value-of select="@type"/><xsl:text>, Link: </xsl:text><xsl:value-of select="@href"/></p>
	</xsl:when>
	<xsl:otherwise>
           	<p><xsl:text>Link: </xsl:text><xsl:value-of select="@href"/></p>
        </xsl:otherwise>
       </xsl:choose>
<!--	   <xsl:if test="@type">
	</xsl:if>
	  <xsl:value-of select="@rel"/>
      <xsl:if test="not(@rel)">[generic link]</xsl:if>
      <xsl:if test="@type">
		<xsl:text> (</xsl:text><xsl:value-of select="@type"/><xsl:text>): </xsl:text>
      </xsl:if>
      <xsl:value-of select="@title"/>-->
    </a>
	<!--
    <xsl:if test="position() != last()">
      <xsl:text> | </xsl:text>
    </xsl:if> -->
  </xsl:template>

  <xsl:template match="a:category" mode="categories">
	<xsl:value-of select="@scheme"/><xsl:text> = </xsl:text><xsl:value-of select="@term"/>
	<br></br>
	<!--		<xsl:if test="position() != last()">
			<xsl:text> | </xsl:text> 
		</xsl:if> -->
  </xsl:template>

  <xsl:template match="*[@type='text']|*[not(@type)]" mode="text-construct">
	<xsl:value-of select="node()" disable-output-escaping="no"/>
  </xsl:template>

  <xsl:template match="*[@type='html']" mode="text-construct">
    <xsl:copy-of select="node()"/>
  </xsl:template>

</xsl:stylesheet>
