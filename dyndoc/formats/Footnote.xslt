<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="2.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:footnote"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string xr-date-formatter">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment out this line to debug -->	<xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
	<!-- Uncomment this line to debug <xsl:include href="CommonFxn.xslt"/>-->

	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>

	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	<xsl:variable as="xs:string" name="FootnoteFormat" select="'%s; %s %s'"/>

	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>

	<!-- This is the main template -->
	<xsl:template match="/">
		<xsl:for-each select="n:report">
			<xsl:call-template name="footnote">
				<xsl:with-param name="footNoteEle" select="n:footnote"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>

	<!-- This is the main template -->
	<xsl:template name="footnote">
		<xsl:param name="footNoteEle"/>
			<span class="ddemrcontentitem" style="font-size:8pt;">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="$footNoteEle/@event-id"/>
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>FOOTNOTE</xsl:text>
				</xsl:attribute>

				<xsl:variable name="Timezone" select="$footNoteEle/n:note/n:service-dt-tm/@time-zone"/>

				<xsl:variable name="Author" as="xs:string">
					<xsl:choose>
						<xsl:when test="$footNoteEle/n:note/@doc-type='RADIOLOGY' and $footNoteEle/n:verifier/n:historical-name">
							<xsl:value-of select="$footNoteEle/n:verifier/n:historical-name"/>
						</xsl:when>
						<xsl:when test="$footNoteEle/n:author/n:historical-name">
							<xsl:value-of select="$footNoteEle/n:author/n:historical-name"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="''"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>

				<xsl:variable name="SeriveDtTm" as="xs:dateTime" select="$footNoteEle/n:note/n:service-dt-tm"/>
				<xsl:variable name="ServiceDate" as="xs:string" select="xr-date-formatter:formatDate($SeriveDtTm, $DATE_SEQUENCE, $Timezone, $current-locale)"/>

				<xsl:value-of select="java-string:format($FootnoteFormat, (cdocfx:getNoteTitleDisplay($footNoteEle), $Author, $ServiceDate))"/>
			</span>
	</xsl:template>
</xsl:stylesheet>
