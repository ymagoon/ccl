<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string xr-date-formatter doc">
	<!-- Comment this line to debug  --><xsl:import href="/cernerbasiccontent/formats/radscommon.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="RadsCommon.xslt"/> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<xsl:param name="current-locale" as="xs:string" select="'en_US'" />
	
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
	
	<!-- showAllCompletedResults will be overwritten by the locale specific format. If true, format will display all completed rad results without the 24 hour limit. -->
	<xsl:variable name="showAllCompletedResults" as="xs:boolean" select="true()"/>
	<!-- This template is used to create a temporary structure with all of the information needed for the display of radiology results.
		 After applying this template we will get multiple radDocuments (equal to number of rad documents in the xml) each containing one
		 or more radExams which represent the details about rad exams along with the interpretations of the documents.
		 radExams within a document will be sorted alphabetically based on the display of the associated order. -->
	<xsl:template match="n:report/n:clinical-data/n:radiology-data/n:radiology-document" mode="preprocessing">
		
		<!-- A single radDocument may hold one or more rad exams under the same document. -->
		<radDocument>
			<!-- Get the section of the radiology document that contains the interpretation. -->
			<xsl:variable name="documentSection" select="n:document-contribution/n:section/n:event-type[fn:exists(@concept-cki) and @concept-cki='CERNER!E824ACDC-7B7B-42AD-97BD-559D552E8771']/parent::node()"/>
			
			<!-- Get the interpretation from the section. -->
			<xsl:variable name="sectionBody">
				<xsl:if test="$documentSection/n:textBody">
					<xsl:value-of select="$documentSection/n:textBody"/>
				</xsl:if>
				<!-- NOTE: Interpretation can also be represented by externalBody or imageBody elements, but we are not supporting those.
					 So the interpretation won't displayed for that scenario. -->
			</xsl:variable>
			
			<!-- This is an attribute of radDocument. -->
			<xsl:attribute name="interpretation" select="$sectionBody"/>
			
			<xsl:for-each select="n:radiology-exam">
				<!-- Sort all rad exams under the current document in alphabetical order of the order display. -->
				<xsl:sort select="lower-case(cdocfx:getRadOrderDisplay(@order-id))" data-type="text" order="ascending"/>
				
				<!-- Only look for orders in COMPLETED status. -->
				<!-- It is possible to get rad exams which were charted more than pendingDateTimeThreshold ago but the corresponding order
					 is in ORDERED status. In that case the order should be displayed under Tests Pending section instead
					 of Radiology Results. -->
				<xsl:variable name="orderStatusMean" select="cdocfx:getRadOrderStatus(@order-id)"/>
				<xsl:variable name="updateDtTm" select="n:updt-dt-tm"/>
				<!-- Convert the updt-dt-tm to UTC for comparison with current dt tm (which is in UTC). -->
				<!-- updt-dt-tm is the clinically significant date/time from the CE table. -->
				<xsl:variable name="updateDtTmUTC" as="xs:dateTime" select="fn:adjust-dateTime-to-timezone($updateDtTm, xs:dayTimeDuration('PT0H'))"/>
				
				<!-- Format the radiology result only if it is COMPLETED and older than pendingDateTimeThreshold. -->
				<xsl:if test="$orderStatusMean = 'COMPLETED' and xs:dateTime($updateDtTmUTC) &lt;= xs:dateTime($pendingDateTimeThreshold)">
					
						<!-- Represents the details about a single rad exam. -->
						<radExam>
							<xsl:attribute name="id" select="@event-id"/>
							<!-- Use the display of the order associated to the rad exam. -->
							<xsl:attribute name="display" select="cdocfx:getRadOrderDisplay(@order-id)"/>
							<xsl:attribute name="radDateTime" select="cdocfx:getRadiologyDateTime($updateDtTm)"/>
						</radExam>
				</xsl:if>
			</xsl:for-each>
		</radDocument>
	</xsl:template>
	
	<!-- Template for sorting radiology documents containing interpretation. This will be called only if at least one document contains
		 a valid interpretation.
		 radExams within a document will be sorted alphabetically based on the display of the associated order.
		 radDocuments will be sorted alphabetically based on the display of the first exam (in alphabetical order) within each document. -->
	<xsl:template name="sortDocumentsWithInterpretations">
		<xsl:param name="radDocuments"/>
		
		<xsl:variable name="radiologyResults">
			<xsl:apply-templates select="$radDocuments" mode="preprocessing"/>
		</xsl:variable>
		
		<xsl:for-each select="$radiologyResults/radDocument">
			<!-- This will sort all radDocuments in alphabetical order based on the display of the first radExam (in alphabetical order) within each radDocument.-->
			<xsl:sort select="lower-case(radExam[1]/@display)" data-type="text" order="ascending"/>
			
			<div class="ddgrouper ddremovable" >
				<xsl:for-each select="radExam">
					<span class="ddemrcontentitem ddremovable">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="@id"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>RADIOLOGY</xsl:text>
					</xsl:attribute>
					
					<xsl:variable name="resultDisplay" as="xs:string" select="@display"/>
					<xsl:variable name="resultDateTime" as="xs:string" select="@radDateTime"/>
					
					<xsl:variable name="formattedDisplay" select="java-string:format($DisplayWithIntepretation, ($resultDisplay, $resultDateTime))"/>
					
					<!--All radExams under a single radDocument should be separated by a comma.-->
					<xsl:choose>
						<xsl:when test="position() != last()">
							<xsl:value-of select="java-string:format($Separator, $formattedDisplay)"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$formattedDisplay"/>
						</xsl:otherwise>
					</xsl:choose>	
					</span>
				</xsl:for-each>
				
				<!-- Display the document interpretation on a new line, after displaying all rad exams for the current document. -->
				<xsl:variable name="FoBlob" as="xs:string" select="@interpretation"/>
				<!-- The first flag indicates what style(s) to remove from the converted HTML:
		 					 0-don't remove styles; 1-remove font face; 2-remove font size; 3-remove both font face and size
		 					 If this is 0 or 1, then the next four flags will be ignored.
		 					 
		 					 The next four flags indicate font size boundaries and the desired smallest and largest font sizes.
		 					 They represent lower bound, upper bound, desired smallest font size, and desired largest font size, respectively.
		 					 Font sizes smaller than or equal to the lower bound will be replaced with the desired smallest font size.
		 					 Font sizes larger than or equal to the upper bound will be replaced with the desired largest font size.
		 					 For example, doc:convertFOtoHTML($FoBlob,3,8,15,8,14) means font sizes <= 8pt will be replaced with 8pt;
		 					 while font sizes >= 15pt will be replaced with 14pt. -->
				<div>
					<xsl:if test="$FoBlob">
						<xsl:value-of disable-output-escaping="yes" select="doc:convertFOtoHTML($FoBlob,3,8,14,8,14)"/>
					</xsl:if>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
	
	<!-- main template -->
	<xsl:template match="/">
		<xsl:variable name="documents" select="n:report/n:clinical-data/n:radiology-data/n:radiology-document"/>
		<!-- Check if any of the documents above have a valid interpretation based on the concept-cki of a section's event type. -->
		<xsl:variable name="interpretations" select="$documents/n:document-contribution/n:section/n:event-type[fn:exists(@concept-cki) and @concept-cki='CERNER!E824ACDC-7B7B-42AD-97BD-559D552E8771']"/>
		
		<xsl:choose>
			<!-- If any document contains an interpretation then we want to display it in a format where all the orders linked to the exams in a single document will be
				 displayed on a single line followed by the interpretation of the document on a new line. -->
			<xsl:when test="fn:count($interpretations) > 0">
				<xsl:call-template name="sortDocumentsWithInterpretations">
					<xsl:with-param name="radDocuments" select="$documents"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<!-- If there is no valid interpretation then we want to sort all rad exams together in alphabetical order and display each on a new line. -->
				<xsl:call-template name="sortRadiologyExams">
					<xsl:with-param name="radExams" select="$documents/n:radiology-exam"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>