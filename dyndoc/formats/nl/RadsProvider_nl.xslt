<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/radsprovider.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../radsprovider.xslt" /> -->
	
	<!-- Values defined in this file override the default values defined in Rads.xslt, RadsCommon.xslt and CommonFxn.xslt-->
	<xsl:import href="/cernerbasiccontent/formats/nl/radsi18ncommon_nl.xslt" />
	
	<!-- These two variables will be used to display the name of the order associated to a rad exam along with the exam date time.
		 This format will be used only when at least one rad document contains a valid interpretation. In this case, we want
		 to display all the exams associated to a single document on one line in a comma separated list followed by the 
		 interpretation of the document (if it exists) on the next line. -->
	<!-- Example:
		 rad-display11 - rad-dt-tm11, rad-display12 - rad-dt-tm12, rad-display13 - rad-dt-tm13
		 interpretation1
		 rad-display21 - rad-dt-tm21, rad-display22 - rad-dt-tm22, rad-display23 - rad-dt-tm23
		 interpretation2 -->
	<xsl:variable name="DisplayWithIntepretation" as="xs:string">
		<xsl:value-of select="'%s - %s'"/>
	</xsl:variable>
	<xsl:variable name="Separator" as="xs:string">
		<xsl:value-of select="'%s, '"/>
	</xsl:variable>
	
	<!-- overwrite showAllCompletedResults. If true, format will display all completed rad results without the 24 hour limit. -->
	<xsl:variable name="showAllCompletedResults" as="xs:boolean" select="true()"/>
</xsl:stylesheet>
